import prisma from "../lib/prisma.js";

// Get all chats for the logged-in user
export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

      const receiver = await prisma.user.findUnique({
        where: {
          id: receiverId,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });
      chat.receiver = receiver;
    }

    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

// Get a specific chat by chat ID
export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat || !chat.userIDs.includes(tokenUserId)) {
      return res.status(403).json({ message: "Unauthorized access to chat." });
    }

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

// Create a new chat between the token user and another user
export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, req.body.receiverId],
      },
    });
    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

// Mark a chat as read by the user
export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });

    if (!chat.userIDs.includes(tokenUserId)) {
      return res.status(403).json({ message: "Unauthorized access to chat." });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to mark chat as read!" });
  }
};

// Get or create chat with a specific user
export const getChatWithUser = async (req, res) => {
  const tokenUserId = req.userId;
  const { receiverId } = req.params;

  try {
    let chat = await prisma.chat.findFirst({
      where: {
        userIDs: {
          hasEvery: [tokenUserId, receiverId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          userIDs: [tokenUserId, receiverId],
          seenBy: [tokenUserId],
        },
        include: {
          messages: true,
        },
      });
    }

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, username: true, avatar: true },
    });

    chat.receiver = receiver;

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get or create chat!" });
  }
};
