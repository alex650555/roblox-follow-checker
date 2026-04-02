const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const CREATOR_USER_ID = "4008230804";

async function checkFollow(userId) {
    try {
        const response = await fetch(`https://friends.roblox.com/v1/users/${userId}/followings`);
        const data = await response.json();
        
        if (data && data.data) {
            for (const user of data.data) {
                if (user.id.toString() === CREATOR_USER_ID) {
                    return true;
                }
            }
        }
        
        const response2 = await fetch(`https://friends.roblox.com/v1/users/${CREATOR_USER_ID}/followers`);
        const data2 = await response2.json();
        
        if (data2 && data2.data) {
            for (const user of data2.data) {
                if (user.id.toString() === userId) {
                    return true;
                }
            }
        }
        
        return false;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

app.get("/checkfollow/:userId", async (req, res) => {
    const userId = req.params.userId;
    const result = await checkFollow(userId);
    
    res.json({
        userId: userId,
        isFollowing: result,
        creatorId: CREATOR_USER_ID
    });
});

app.get("/", (req, res) => {
    res.json({ status: "online", message: "Servidor funcionando" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
});
