import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  if (!product.affiliateUrl) {
    return NextResponse.redirect(
      new URL(`/products/${product.slug}`, request.url)
    );
  }

  return NextResponse.redirect(
    product.affiliateUrl
  );
}