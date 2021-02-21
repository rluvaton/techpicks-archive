const util = require("util");
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const whatsapp = require("whatsapp-chat-parser");

const fs_readFile = util.promisify(fs.readFile);
const fs_writeFile = util.promisify(fs.writeFile);

const tpRegex = /^TechPicks (\d+\/\d+\/\d+)*/;

const start = async (file, dest_dir) => {
  const log = await fs_readFile(path.resolve(__dirname, file), "utf8");
  const parsed = await whatsapp.parseString(log);
  const filterd = parsed.filter((message) => message.message.match(tpRegex));
  for (const techpicks of filterd) {
    await save(techpicks, dest_dir);
  }
};

const save = async (data, dest_dir) => {
  const match = data.message.match(tpRegex);
  const date = match[1] ? match[1].split("/") : false;
  if (date && date.length == 3) {
    const _file = `teckpicks_${date.join("_")}.txt`;
    const _path = path.join(__dirname, dest_dir, date[2], date[1]);
    await mkdirp(_path);
    await fs_writeFile(path.join(_path, _file), data.message, "utf8");
  }
};

start("general.txt", "archive");
