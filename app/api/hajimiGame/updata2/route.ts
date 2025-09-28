import { NextRequest, NextResponse } from "next/server";
import { progressData } from "../progressData";

export async function POST(request: NextRequest) {
  const { progress } = await request.json();
  progressData.progress_2 = progress;
  return NextResponse.json({
    ...progressData,
  });
}
