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
router.get("/analyze", async (req, res) => {
  const { failedUnit } = req.query;
  const session = driver.session({ database: "cityinfrastructure" });

  try {
    const rootCause = await session.run(
      `
      MATCH path=(f:InfrastructureUnit {name:$name})-[:DEPENDS_ON*]->(root)
      RETURN path
      `,
      { name: failedUnit }
    );

    const cascade = await session.run(
      `
      MATCH (root:InfrastructureUnit {name:$name})<-[:DEPENDS_ON*]-(affected)
      RETURN affected
      `,
      { name: failedUnit }
    );

    const rootPaths = rootCause.records.map(r =>
      r.get("path").segments.map(s => ({
        from: s.start.properties.name,
        to: s.end.properties.name
      }))
    );

    const cascadeNodes = cascade.records.map(r =>
      r.get("affected").properties
    );

    res.json({
      rootCause: rootPaths,
      cascade: cascadeNodes
    });
  } finally {
    await session.close();
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
