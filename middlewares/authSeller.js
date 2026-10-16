
import { prisma } from "@/lib/prisma";

const authSeller = async (userId) => {
  try {
    if (!userId) {
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { store: true },
    });

    if (!user || !user.store) {
      return false;
    }

    if (user.store.status === "approved") {
      return user.store.id;
    }

    return false;
  } catch (error) {
    console.error("Error authenticating seller:", error);
    return false;
  }
};

export default authSeller;
