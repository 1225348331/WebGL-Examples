import fs from "fs";
import path from "path";
import { omit } from "lodash-es";

/** 目录树 */
interface Tree {
  /** 目录名称 */
  name: string;
  /** 子目录树 */
  children?: Tree[];
}

/**
 * @description: 获取所有的目录
 * @param {string} rootDir
 */
function getAllSubdirectories(rootDir: string) {
  let subdirectories: Tree[] = [];

  // 读取目录下的所有文件和子目录
  const filesAndDirs = fs.readdirSync(rootDir);

  filesAndDirs.forEach((name) => {
    const filePath = path.join(rootDir, name);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      let node: Tree = {
        name,
        children: [],
      };
      // 递归获取子目录的子目录
      node.children = getAllSubdirectories(filePath);
      if (!node.children.length) node = omit(node, "children");
      subdirectories.push(node);
    }
  });
  return subdirectories;
}

function getAllFileName(rootDir: string) {
  const files = fs.readdirSync(rootDir);
  return files.map((item) => {
    return "/data/" + item;
  });
}

/**
 * @description: 获取目录插件
 * @param {object} options 可配置选项
 */
export default function getFileNamePlugin(options?: { viewsDir: string }) {
  const viewsDir = options?.viewsDir || "public/data";

  return {
    name: "rollup-plugin-getDirs",
    resolveId(id: string) {
      return id;
    },
    load(id: string) {
      if (id == "virtual-scy:views") {
        // 获取所有子目录
        const subdirectories = getAllFileName(path.resolve(viewsDir));
        // 生成一个模块，导出所有子目录路径
        const code = `export default ${JSON.stringify(subdirectories)};`;
        return code;
      }
    },
  };
}
