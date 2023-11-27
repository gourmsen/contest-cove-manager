import crypto from 'crypto';

// interfaces
import { SignUpRequest } from "../interfaces/sign-up-request";
import { SignUpResponse } from "../interfaces/sign-up-response";

import { SignInRequest } from "../interfaces/sign-in-request";
import { SignInResponse } from "../interfaces/sign-in-response";

// module variables
let status: number;
let payload: any;

module.exports = {
    signUp(signUpRequest: SignUpRequest) {
        let db = require('../functions/database.ts');

        // query users for userId
        let users = db.queryDatabase(
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
        let privateToken: string = "";
        let publicToken: string = "";
        while (true) {

            // generate token pair
            let newPrivateToken: string = String(signUpRequest.name).toLowerCase() + "-" + crypto.randomBytes(10).toString("hex");
            let newPublicToken: string = crypto.createHash("sha256").update(newPrivateToken).digest("hex");

            // query users for tokenId
            users = db.queryDatabase(
                `SELECT tokenId
                FROM users
                WHERE tokenId = ?`,
                [newPublicToken]);

            // check existing token
            if (!users.length) {
                privateToken = newPrivateToken;
                publicToken = newPublicToken;

                break;
            }
        }

        // write new user to table users
        let modtime = db.getModtime();

        db.writeDatabase(
            `INSERT INTO users (
                userId,
                tokenId,
                name,
                modtime
                ) VALUES (?, ?, ?, ?)`,
            [
                signUpRequest.userId,
                publicToken,
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
                privateToken: privateToken,
                publicToken: publicToken
            }
        }

        status = 201;
        payload = signUpResponse;

        return [status, payload];
    },
    signIn(signInRequest: SignInRequest) {
        let db = require('../functions/database.ts');
        
        // hash private token
        let publicToken: string = crypto.createHash("sha256").update(signInRequest.tokenId).digest("hex");

        // query users for tokenId
        let users = db.queryDatabase(
            `SELECT userId, tokenId, name
            FROM users
            WHERE tokenId = ?`,
            [publicToken]);
        
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