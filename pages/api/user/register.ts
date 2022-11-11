import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import bcrypt from 'bcryptjs';
import { jwt, validations } from '../../../utils';


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

export default function handlrer(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return registerUser(req, res)

        default:
            return res.status(400).json({ message: 'bad request' })
    }

}

const registerUser = async (req: NextApiRequest, res: NextApiResponse) => {

    const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string };

    if (password.length < 6) {
        return res.status(400).json({ message: 'la contraseña debe de ser de 6 caracteres o mas' })
    }

    if (name.length < 2) {
        return res.status(400).json({ message: 'El debe de ser de 2 caracteres o mas' })
    }

    if (!validations.isValidEmail(email)) {
        console.log(email)
        return res.status(400).json({ message: 'El formato del correo no es valido' })
    }

    await db.connect();
    const user = await User.findOne({ email });


    if (user) {

        return res.status(400).json({ message: 'Ya existe este usuario' })
    }
    const newUser = new User({
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name,
    })

    try {
        await newUser.save({ validateBeforeSave: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'revisar logs del servidor' })
    }

    const { _id, role } = newUser;

    const token = jwt.signToken(_id, email);

    return res.status(200).json({
        token,  //jwt
        user: {
            email,
            role,
            name,
        }
    }
    )
}