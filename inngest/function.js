import { inngest } from "./client";

//inngest function to save userData from Database

export const syncUserCreation = inngest.createFunction(
    { id:"sync-user-create",
    triggers:{event:"clerk/user.created"}
    },
    async ({event})=>{
        const {data} = event;
        await prisma.user.create({
            data:{
                id:data.id,
                email:data.email_address[0].email_address,
                name:`${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
                image:data.image_url,
            }
        })
    }
)

//inngest function to update user data in database
export const syncUserUpdate = inngest.createFunction(
  {id: "sync-user-update" ,
  triggers:{ event: "clerk/user.updated"} 

  },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.update({
      where: {
        id: data.id,
      },
      update: {
        email: data.email_address[0].email_address,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        image: data.image_url,
      },
    //   //create creates the user if they doesn't exist
    //   create: {
    //     id: data.id,
    //     email: data.email_address[0].email_address,
    //     name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
    //     image: data.image_url,
    //   },
    });
  }
);

//inngest function to delete a user from database   
export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete" ,
  triggers:{event: "clerk/user.deleted" }
  },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.delete({
      where: {
        id: data.id,
      },
    });
  }
);