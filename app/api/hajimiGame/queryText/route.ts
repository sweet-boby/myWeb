import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const textList: string[] = [
    "abc aaa aaaaa aaaa aaaa",
    "bbbbb bbbbbb bbb bbbbbb",
  ];
  return NextResponse.json(textList);
}
