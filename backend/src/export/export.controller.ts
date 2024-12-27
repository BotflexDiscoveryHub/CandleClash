import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('users')
  async exportTable(@Res() res: Response): Promise<void> {
    return await this.exportService.generateExcel(res);
  }
}
