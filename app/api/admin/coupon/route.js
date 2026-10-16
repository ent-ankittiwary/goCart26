import { prisma } from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

// Create coupon API

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      );
    }

    const { coupon } = await request.json();

    if (!coupon?.code?.trim()) {
      return NextResponse.json(
        { error: "Coupon code is required" },
        { status: 400 }
      );
    }

    coupon.code = coupon.code.trim().toUpperCase();

    // Create the coupon only once
    const newCoupon = await prisma.coupon.create({
      data: coupon,
    });

    // Send expiry event separately
    try {
      await inngest.send({
        name: "app/coupon.expired",
        data: {
          code: newCoupon.code,
          expires_at: newCoupon.expiresAt,
        },
      });
    } catch (inngestError) {
      console.error("Inngest event failed:", inngestError);

      // Coupon is already saved in the database
      return NextResponse.json(
        {
          message: "Coupon created, but expiry scheduling failed.",
          coupon: newCoupon,
          warning: "Check your Inngest Event Key and configuration.",
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        message: "Coupon added successfully",
        coupon: newCoupon,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create coupon error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This coupon code already exists. Please use another code." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create coupon" },
      { status: 400 }
    );
  }
}


// Delete coupon API
export async function DELETE(request) {
  try {
    // FIX: Pass request to getAuth
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      );
    }

    const { searchParams } = request.nextUrl;
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Coupon code is required" },
        { status: 400 }
      );
    }

    await prisma.coupon.delete({
      where: { code: code.trim().toUpperCase() },
    });

    return NextResponse.json({
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Delete coupon error:", error);

    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

// Get all coupons API
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      );
    }

    const coupons = await prisma.coupon.findMany({});

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Fetch coupons error:", error);

    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

