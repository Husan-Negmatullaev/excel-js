import "@styles/main.scss"

async function start() {
    return await Promise.resolve("Console async text");
}

start().then(console.log)