const express = require("express");
const driver = require("./neo4j");

const router = express.Router();

/**
 * 1️⃣ Infrastructure Network
 */
router.get("/infrastructure", async (req, res) => {
  const session = driver.session({ database: "cityinfrastructure" });

  try {
    const result = await session.run(`
      MATCH (n)-[r:DEPENDS_ON]->(m)
      RETURN n, r, m
    `);

    const data = result.records.map(record => ({
      from: record.get("n").properties,
      to: record.get("m").properties,
      relationship: record.get("r").type
    }));

    res.json(data);
  } finally {
    await session.close();
  }
});

/**
 * 2️⃣ Failure Analysis
 */
router.get("/analyze-region", async (req, res) => {
  const { region, locations } = req.query;
  const session = driver.session({ database: "cityinfrastructure" });

  try {
    const locationArray = locations.split(',');

    // Find all critical units in this region (high dependency count)
    const criticalResult = await session.run(
      `
      MATCH (n:InfrastructureUnit)
      WHERE n.location IN $locations
      OPTIONAL MATCH (dependent)-[:DEPENDS_ON*]->(n)
      WITH n, COUNT(DISTINCT dependent) as dependentCount
      WHERE dependentCount > 0
      RETURN n, dependentCount
      ORDER BY dependentCount DESC
      LIMIT 5
      `,
      { locations: locationArray }
    );

    const criticalUnits = criticalResult.records.map(r => ({
      ...r.get('n').properties,
      dependentCount: r.get('dependentCount').toNumber()
    }));

    // Count total units
    const totalResult = await session.run(
      `
      MATCH (n:InfrastructureUnit)
      WHERE n.location IN $locations
      RETURN COUNT(n) as total
      `,
      { locations: locationArray }
    );

    const totalUnits = totalResult.records[0].get('total').toNumber();

    // Generate vulnerabilities
    const vulnerabilities = [];
    if (criticalUnits.length > 0) {
      vulnerabilities.push(`${criticalUnits.length} critical infrastructure units identified`);
      vulnerabilities.push(`Single point of failure risk in ${criticalUnits[0].name}`);
    }

    await session.close();

    res.json({
      region,
      criticalUnits,
      vulnerabilities,
      totalUnits
    });

  } catch (error) {
    await session.close();
    console.error('Region analysis error:', error);
    res.status(500).json({ error: 'Analysis failed', details: error.message });
  }
});



/**
 * 3️⃣ Critical Infrastructure
 */
router.get("/critical", async (req, res) => {
  const session = driver.session({ database: "cityinfrastructure" });

  try {
    const result = await session.run(`
      MATCH (n:InfrastructureUnit)<-[:DEPENDS_ON]-(x)
      RETURN n.name AS name, COUNT(x) AS dependencyCount
      ORDER BY dependencyCount DESC
    `);

    const data = result.records.map(r => ({
      name: r.get("name"),
      dependencyCount: r.get("dependencyCount").toNumber()
    }));

    res.json(data);
  } finally {
    await session.close();
  }
});

module.exports = router;
