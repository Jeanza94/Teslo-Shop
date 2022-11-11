
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import { jwt } from '../../../utils';


type Data =
    | { message: string }
    | {
        token: string,
        user: {
            email: string,
            name: string,
            role: string
        }
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


    switch (req.method) {
        case 'GET':
            return checkJWT(req, res)

        default:
            return res.status(400).json({ message: 'bad request' })
    }

}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse) => {

    const { token = '' } = req.cookies;

    let userId = '';

    try {
        userId = await jwt.isValidToken(token); //el userId es el mismo _id
    } catch (error) {
        return res.status(401).json({
            message: 'Token de autorización no es valido'
        })
    }


    await db.connect();
    const user = await User.findById(userId).lean();
    db.disconnect();

    if (!user) {
        return res.status(400).json({ message: 'No existe usuario con ese id' })
    }


    const { _id, email, role, name } = user

    return res.status(200).json({
        token: jwt.signToken(_id, email),  //crea otro jwt, lo revalida
        user: {
            email, role, name
        }
    })
}