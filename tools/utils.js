module.exports.askCheck = async (fanficContext) => {
  const readline = require("node:readline/promises");
  const { stdin: input, stdout: output } = require("node:process");
  const rl = readline.createInterface({ input, output });

  const ask = async () => {
    const answer = await rl.question(`В фэндоме нет работ. Проверить? (д/н) `);

    if (answer === "д") {
      console.log(`${fanficContext.url}\n`);
    } else if (answer !== "н") {
      await ask();
    }

    rl.close();
  };

  await ask();
};

module.exports.askDelete = async () => {
  const readline = require("node:readline/promises");
  const { stdin: input, stdout: output } = require("node:process");
  const rl = readline.createInterface({ input, output });
  let answer;

  const ask = async () => {
    answer = await rl.question(`Перезаписать количество работ? (д/н) `);

    if (answer === "д") {
      console.log("Перезаписано\n");
    } else if (answer === "н") {
      console.log("Не перезаписано\n");
    } else {
      await ask();
    }

    rl.close();
  };

  await ask();

  return new Promise((resolve) => {
    if (answer === "д" || answer === "н") {
      resolve(answer);
    }
  });
};
