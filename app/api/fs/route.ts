import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  // const res = fs.readdirSync(`./public/${path}`);
  // 读取path下的所有文件和子文件
  const res: string[] = [];
  const readDir = (path: string) => {
    const files = fs.readdirSync(path);
    for (let i = 0; i < files.length; i++) {
      const stats = fs.statSync(path + "/" + files[i]);
      if (stats.isDirectory()) {
        readDir(path + "/" + files[i]);
      } else {
        res.push(path + "/" + files[i]);
      }
    }
  };
  readDir(`./public/${path}`);
  const data = res.map((item) => item.replace(`./public/${path}/`, ""));
  // console.log(res, res.length, data);
  return NextResponse.json({ data: data }, { status: 200 });
}

export async function POST(request: Request) {
  const res = await request.json();
  return Response.json({ res });
}
