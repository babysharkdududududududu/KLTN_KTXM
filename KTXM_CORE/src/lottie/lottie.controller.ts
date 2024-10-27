import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as lottie from 'lottie-node';
import { join } from 'path';

@Controller('lottie')
export class LottieController {
    @Get('animation')
    async getAnimation(@Res() res: Response) {
        const animationPath = join(__dirname, '..', 'animations', 'confirm.json');

        const animationData = await lottie.loadAnimation({
            path: animationPath,
            renderer: 'svg',
            loop: true,
            autoplay: true,
        });

        res.setHeader('Content-Type', 'application/json')
        res.send(animationData);
    }
}
