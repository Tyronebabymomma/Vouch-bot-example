import { Client, ClientUser, IntentsBitField, ReactionUserManager, User } from "discord.js";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
const token = process.env.TOKEN;
const prefix: string = "?";

const client = new Client({
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageTyping
    ]
});

client.once("ready", () => console.log(`${client.user?.username} is logged in!`));

client.on("messageCreate", async (message) => {
    const msg: string = message.content;

    if (msg.charAt(0) !== prefix) return;

    const commandName: string = msg.slice(prefix.length).split(" ")[0].toLowerCase();
    const args: string[] | undefined = msg.split(" ").slice(1)

    if (message.author == client.user) return;

    if (commandName === "vouch") {
        if (args[0] == undefined) {
            await message.channel.send("You must specify a member!")
            return
        };

        let member;

        if (!message.mentions.users.first() ) {

            if (!message.guild?.members.cache.get(args[0])){
                await message.channel.send("This user is not in this server, or the id you provided is not valid.")
                return;
            }


            member = client.users.cache.get(args[0]);
        } else {
            member = message.mentions.users?.first();
        };

        if (member?.id == message.author.id) {
            await message.channel.send("You can't vouch yourself!")
            return;
        }

        if (await prisma.vouches.findUnique({where: {id: member?.id}}) === null){
            await prisma.vouches.create({
                data:{
                    id: member?.id!
                }
            })
        }

        await prisma.vouches.update({
            where:{
                id: member?.id!
            },

            data:{
                vouchesRecived: {
                    increment: 1
                }
            }
        })

        if (await prisma.vouches.findUnique({where:{id: message.author.id}}) === null){
            await prisma.vouches.create({
                data:{
                    id: message.author.id
                }
            })
        }

        await prisma.vouches.update({
            where:{
                id: message.author.id
            },

            data:{
                vouchesGiven: {
                    increment: 1
                }
            }
        })

        await message.channel.send("Successfully vouched member!")

        return;
    }

    if (commandName === "vouches"){
        let member;

        if (args[0] == undefined){
            member = message.author
        }

        if (message.mentions.users.first() == undefined && args[0] != undefined) {

            if (!message.guild?.members.cache.get(args[0])) {
                await message.channel.send("This user is not in this server, or the id you provided is not valid.")
                return;
            }

            member = client.users.cache.get(args[0]);
        } else if (message.mentions.users.first()) {
            member = message.mentions.users?.first();
        };

        if (await prisma.vouches.findUnique({where: {id: member?.id}}) === null) {
            await prisma.vouches.create({
                data: {
                    id: member?.id!
                }
            })
        }

        const memberVouches = await prisma.vouches.findUnique({
            where:{
                id: member?.id!
            }, select:{
                vouchesRecived: true,
                vouchesGiven: true
            }});


        await message.channel.send(`${member?.username} has received ${memberVouches?.vouchesRecived} and has given ${memberVouches?.vouchesGiven}`)
        return;
    }
});

client.login(token);
