import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const messages = await prisma.massage.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const { sender, text, receiver } = await req.json();
        const message = await prisma.massage.create({
            data: {
                sender,
                text,
                receiver,
            },
        });
        return NextResponse.json(message);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const { id, sender, text, receiver } = await req.json();
        const updatedMessage = await prisma.massage.update({
            where: { id: Number(id) },
            data: {
                sender,
                text,
                receiver,
            },
        });
        return NextResponse.json(updatedMessage);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        await prisma.massage.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json({ message: "Message deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
