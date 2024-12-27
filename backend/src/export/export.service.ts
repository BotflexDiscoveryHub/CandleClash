import { Inject, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { UserRepositoryInterface } from '../db/repositories/users/users.repository.interface';

@Injectable()
export class ExportService {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UserRepositoryInterface,
  ) {}

  async generateExcel(res: Response): Promise<void> {
    const users = await this.usersRepository.findAll();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    // Добавление заголовков
    worksheet.addRow([
      'id',
      'telegramId',
      'firstName',
      'lastName',
      'username',
      'languageCode',
      'pointsBalance',
      'referrer',
      'inviteLink',
      'friendsCount',
      'lastRequestAt',
      'liquidity',
      'dailyLiquidityPools',
      'giftLiquidityPools',
      'datesOfVisits',
      'rewards',
      'boosts',
      'collectedItems',
      'level',
      'lastLevelUpDate',
      'createdAt',
    ]);

    // Добавление данных
    users.forEach(
      ({
        id,
        telegramId,
        firstName,
        lastName,
        username,
        languageCode,
        pointsBalance,
        referrer,
        inviteLink,
        friendsCount,
        lastRequestAt,
        liquidity,
        dailyLiquidityPools,
        giftLiquidityPools,
        datesOfVisits,
        rewards,
        boosts,
        collectedItems,
        level,
        lastLevelUpDate,
        createdAt,
      }) => {
        worksheet.addRow([
          id,
          telegramId,
          firstName,
          lastName,
          username,
          languageCode,
          pointsBalance,
          referrer,
          inviteLink,
          friendsCount,
          lastRequestAt,
          liquidity,
          dailyLiquidityPools,
          giftLiquidityPools,
          datesOfVisits,
          rewards,
          boosts,
          collectedItems,
          level,
          lastLevelUpDate,
          createdAt,
        ]);
      },
    );

    // Установка формата и имени файла
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

    await workbook.xlsx.write(res);

    res.end();
  }
}
