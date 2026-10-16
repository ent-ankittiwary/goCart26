

//toggle stock of product

import authSeller from "@/middlewares/authSeller";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
try {
const { userId } = getAuth(request);
const { productId } = await request.json();


if(!productId){
return NextResponse. json({ error: "missing details: productId" }, {
status: 400 });
}

const storeId = await authSeller(userId);
if(!storeId){
return NextResponse.json({error:'not authorised'},{status:401})}


//check if product exists
const product = await prisma.product.findFirst({
    where:{id:productId,storeId}
});

if(!product){
    return NextResponse.json({error:"no product found"},{status:404})
}
await prisma.product.update({
    where:{id:productId},
    data:{inStock:!product.inStock}
});

return NextResponse.json({message:"product added successfullty"});
} catch (error){

    console.error(error);
    return NextResponse.json({error:error.message || error.code },{status:400});
}
}
