// functions
import { database } from '../functions/database';
import crypto from 'crypto';

// interfaces
import { SignUpRequest } from "../interfaces/sign-up-request";
import { SignUpResponse } from "../interfaces/sign-up-response";

import { SignInRequest } from "../interfaces/sign-in-request";
import { SignInResponse } from "../interfaces/sign-in-response";

// module variables
let status: number;
let payload: any;

export const auth = {
    signUp(signUpRequest: SignUpRequest) {
        // query users for userId
        let users = database.queryDatabase(
            `SELECT userId
            FROM users
            WHERE userId = ?`,
            [signUpRequest.userId]);

        // check existing user
        if (users.length) {
            status = 409;
            payload = {
                message: "User already exists."
            }

            return [status, payload];
        }

        // generate new token
        let privateTokenId: string = "";
        let publicTokenId: string = "";
        while (true) {

            // generate token pair
            let newPrivateTokenId: string = String(signUpRequest.name).toLowerCase() + "-" + crypto.randomBytes(10).toString("hex");
            let newPublicTokenId: string = crypto.createHash("sha256").update(newPrivateTokenId).digest("hex");

            // query users for tokenId
            users = database.queryDatabase(
                `SELECT tokenId
                FROM users
                WHERE tokenId = ?`,
                [newPublicTokenId]);

            // check existing token
            if (!users.length) {
                privateTokenId = newPrivateTokenId;
                publicTokenId = newPublicTokenId;

                break;
            }
        }

        // write new user to table users
        let modtime = database.getModtime();

        database.writeDatabase(
            `INSERT INTO users (
                userId,
                tokenId,
                name,
                modtime
                ) VALUES (?, ?, ?, ?)`,
            [
                signUpRequest.userId,
                publicTokenId,
                signUpRequest.name,
                modtime
            ]
        );

        // prepare response
        let signUpResponse: SignUpResponse = {
            message: "User created.",
            data: {
                userId: signUpRequest.userId,
                name: signUpRequest.name,
                privateTokenId: privateTokenId,
                publicTokenId: publicTokenId
            }
        }

        status = 201;
        payload = signUpResponse;

        return [status, payload];
    },
    signIn(signInRequest: SignInRequest) {

        // hash private token
        let publicTokenId: string = crypto.createHash("sha256").update(signInRequest.tokenId).digest("hex");

        // query users for tokenId
        let users = database.queryDatabase(
            `SELECT userId, tokenId, name
            FROM users
            WHERE tokenId = ?`,
            [publicTokenId]);
        
        // check existing token
        if (!users.length) {
            status = 401;
            payload = {
                message: "No user found with this token."
            }

            return [status, payload];
        }

        // prepare response
        let signInResponse: SignInResponse = {
            message: "Sign-in successful.",
            data: {
                tokenId: users[0].tokenId,
                userId: users[0].userId,
                name: users[0].name
            }
        }

        status = 200;
        payload = signInResponse;

        return [status, payload];
    }
}