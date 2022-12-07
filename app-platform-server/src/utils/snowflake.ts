// eslint-disable-next-line @typescript-eslint/no-var-requires
const SnowflakeId = require("snowflake-id").default

export function genId() {
    const id = new SnowflakeId();
    return id.generate().toString()
}
