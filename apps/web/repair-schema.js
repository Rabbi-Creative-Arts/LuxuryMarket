const fs = require("fs");

const file = "prisma/schema.prisma";

let text = fs.readFileSync(file, "utf8");

// Merge any standalone @relation onto the previous field line
text = text.replace(
  /^([ \t]*\w+[ \t]+[\w?\[\]]+)\r?\n([ \t]+@relation\([^\n]+\))/gm,
  "$1 $2"
);

fs.writeFileSync(file, text);

console.log("✅ Schema repaired successfully.");