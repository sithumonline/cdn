import { walk } from "https://deno.land/std@0.146.0/fs/mod.ts";
import { parse } from "https://deno.land/std@0.146.0/path/mod.ts";

const makeUpperCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

async function printFilesNames() {
  for await (const entry of walk("./svgs")) {
    const { name, ext } = parse(entry.path);
    if (ext === ".svg") {
      let text = await Deno.readTextFile(entry.path);
      const splitName = name.split("-");
      const newName = splitName
        .map((item) => {
          return makeUpperCase(item);
        })
        .join("");

      console.log(`fa${newName}`);

      text = text.replace(/<!--.*-->/g, "");
      text = text.replace(/<svg/g, "<svg class={props.class}");

      await Deno.writeTextFile(
        "./faIcons.js",
        `\nexport function fa${newName}(props) {
                return (${text});
            }\n`,
        { append: true },
      );
    }
  }
}

printFilesNames().then(() => console.log("Done!"));

/*

git clone https://github.com/FortAwesome/Font-Awesome.git
cp -rf main.js Font-Awesome
cd Font-Awesome
deno run --allow-read  --allow-write main.js
deno fmt faIcons.js
cd ..
cp -rf Font-Awesome/faIcons.js ./
rm -rf Font-Awesome
git add faIcons.js
git commit -m "Update Font-Awesome icons"
git push

*/
