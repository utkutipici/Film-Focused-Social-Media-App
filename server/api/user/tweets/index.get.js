import { getTweets } from "~~/server/db/tweets"
import { tweetTransformer } from "~~/server/transformers/tweet"
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const userId = event.context.auth?.user?.id

    let prismaQuery = {
        where: {
            authorId: userId
        },
        include: {
            author: true,
            mediaFiles: true,
            replies: {
                include: {
                    author: true
                }
            },
            replyTo: {
                include: {
                    author: true
                }
            }
        },
        orderBy: [
            {
                createdAt: 'desc'
            }
        ]
    }

    if (query.query) {
        prismaQuery = {
            ...prismaQuery,
            where: {
                ...prismaQuery.where,
                text: {
                    contains: query.query
                }
            }
        }
    }

    const tweets = await getTweets(prismaQuery)

    return {
        tweets: tweets.map(tweetTransformer)
    }
})
