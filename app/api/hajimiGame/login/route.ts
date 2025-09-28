import { NextRequest, NextResponse } from "next/server";
import { progressData } from "../progressData";

export async function POST(request: NextRequest) {
  const { progressID, msg } = await request.json();
  if (msg === "logout") {
    progressID === 1 && (progressData.progress_1 = -1);
    progressID === 2 && (progressData.progress_2 = -1);
    return NextResponse.json({ progressID: -1 });
  }

  if (progressData.progress_1 >= 0 && progressData.progress_2 >= 0) {
    return NextResponse.json({ progressID: -1 });
  }
  if (progressData.progress_1 >= 0) {
    progressData.progress_2 = 0;
    return NextResponse.json({ progressID: 2 });
  } else {
    progressData.progress_1 = 0;
    return NextResponse.json({ progressID: 1 });
  }
}
