import { CanvasRenderingContext2D, Image } from 'canvas';
export class Draw {
    public constructor() {

    }

    public drawProgressBar(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, progress: number) {
        // Empty bar
        context.fillStyle = '#BEBEBE';
        context.fillRect(x, y, width, height);
        // Filled bar
        const gradient = context.createLinearGradient(x, y, x + width, y);
        gradient.addColorStop(0, '#12D6DF');
        gradient.addColorStop(1, '#F70FFF');
        context.lineJoin = 'round';
        context.fillStyle = gradient;
        context.fillRect(x, y, width * progress, height);
    }

    public drawProgressBarForUser(context: CanvasRenderingContext2D, progress: number, x: number, y: number, width: number, height: number) {
        // Empty bar
        context.fillStyle = '#BEBEBE';
        context.fillRect(x, y, width, height);
        // Filled bar
        const gradient = context.createLinearGradient(x, y, x + width, y);
        gradient.addColorStop(0, '#12D6DF');
        gradient.addColorStop(1, '#F70FFF');
        context.lineJoin = 'round';
        context.fillStyle = gradient;
        context.fillRect(x, y, width * progress, height);
    }

    public drawUserAvatar(context: CanvasRenderingContext2D, image: Image, x: number, y: number, size: number) {

        context.save();
        context.beginPath();
        context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        context.drawImage(image, x, y, size, size);
        context.restore();
    }

    public drawUserData(context: CanvasRenderingContext2D, username: string, level: string, xp: string, x: number, y: number) {
        context.font = '16px Poppins SemiBold';
        context.fillStyle = '#000000';
        context.textAlign = 'left';
        context.fillText(username + ' (Tú)', x, y + 12);
        context.fillText(`Nivel: ${level}`, x, y + 32);
        context.fillText(`XP: ${xp}`, x + 650, y + 10);
    }

    public drawRoundedImage(context: CanvasRenderingContext2D, image: Image, x: number, y: number, size: number) {
        context.save();
        context.beginPath();
        context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        context.drawImage(image, x, y, size, size);
        context.restore();
    }

    private isMultipleDigits(num: number): boolean {
        return num >= 10 || num <= -10;
    }

    public drawFormattedRank(context: CanvasRenderingContext2D, rank: string, x: number, y: number) {
        context.font = '30px Bahnschrift';
        context.fillStyle = '#A8A8A8';
        context.textAlign = 'left';
        // Intenta convertir rank a un número
        const rankNumber = parseInt(rank, 10);
    
        if (!isNaN(rankNumber)) {
            if (this.isMultipleDigits(rankNumber)) {
                x -= 1.5;
            } else if (rank.includes('K')) {
                x -= 3;
            }
            // Utiliza rankNumber en lugar de rank para operaciones matemáticas
            context.fillText(rankNumber.toString(), x, y);
        } else {
            console.error('El valor de "rank" no es un número válido:', rank);
        }
    }
}
