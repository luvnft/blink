import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils";
export const runtime = 'edge';

// Define CORS headers
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", // Or specify your allowed origin
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async (req: NextRequest) => {
  return NextResponse.json({}, { headers: CORS_HEADERS });
};

export const POST = async (req: NextRequest) => {
    const apiKey = req.headers.get("AUTHORIZATION");
    if (!apiKey){
        return NextResponse.json({
            msg: "Please provide a valid api key"
        })
    }

    const host= await prisma.host.findFirst({
        where: {
            apiKey
        }
    })

    if (!host) {
        return NextResponse.json({
            msg:"Invalid API KEY"
        }, {
            status: 403
        })
    }

    const {name, amount, imageUrl, type, description, questions, types, interval}: {
        name: string;
        amount: number,
        imageUrl: string,
        type: string,
        description: string,
        questions: string[],
        types: string[],
        interval: number
    } = await req.json();

    if (!(name || amount || imageUrl || type || description|| questions || types || interval )){
        return NextResponse.json({
            msg: "Please provide all the required fields"
        }, {
            status: 400
        })
    }
    try{   
        const blink = await prisma.bounties.create({
            data: {
                name,
                amount,
                imageUrl,
                type,
                description,
                questions,
                types,
                interval: new Date(interval),
                hostId: host.id as number,
                isVerified: true,
                isActive: true
            }
        })

        const response = {
            blinkId: blink.id,
            url: `https://dial.to/?action=solana-action%3A${encodeURIComponent("https://barkprotocol.com")}%2Fapi%2Fapp%2Factions%3Fid%3D${blink.id}&cluster=devnet`
        }

        return NextResponse.json({
            msg: "Blink created successfully",
            success: true,
            blinkInfo: response
        }, 
         {
            headers: {
                ...CORS_HEADERS,
            },
            status: 200
        })

    } catch (err) {
        console.log(err);
        return NextResponse.json({
            msg: "Error creating bounty"
        }, {
            headers: CORS_HEADERS,
            status: 500
        })
    }
}