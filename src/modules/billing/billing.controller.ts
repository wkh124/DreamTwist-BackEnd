/**
File Name : billing.controller
Description : 상품 결제 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.08.01  이유민      Created     
2024.08.01  이유민      Modified    결제 관련 기능 추가
2024.08.03  박수정      Modified    Swagger Decorator 적용
2024.08.04  이유민      Modified    결제 취소 추가
2024.08.04  이유민      Modified    결제 내역 조회 추가
*/

import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BillingService } from 'src/modules/billing/billing.service';
import { BillingDTO, CancelDTO } from 'src/modules/billing/billing.dto';
import { Payment } from 'src/modules/billing/entity/payment.entity';
import { ApiPostOperation, ApiGetOperation } from 'shared/utils/swagger.decorators';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) {}

    @ApiPostOperation({
        summary: '결제 승인',
        successMessage: '결제 승인 성공',
        successDescription: '결제 승인 성공',
    })
    @Post()
    async tossPayment(@Body() billingDTO: BillingDTO) {
        return this.billingService.tossPayment(billingDTO);
    }

    @ApiPostOperation({
        summary: '결제 취소',
        successMessage: '결제 취소 성공',
        successDescription: '결제 취소 성공',
    })
    @Post('cancel')
    async cancelPayment(@Body() cancelDTO: CancelDTO): Promise<object> {
        return this.billingService.cancelPayment(cancelDTO);
    }

    @ApiGetOperation({
        summary: '사용자 결제내역 전체 조회',
        successResponseSchema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    payment_key: { type: 'string', example: 'tviva1234567890' },
                    amount: { type: 'number', example: 11000 },
                    method: { type: 'string', example: '간편결제' },
                    order_name: { type: 'string', example: '50 포인트 충전' },
                    isRefundable: { type: 'string', example: 'F' },
                },
                required: ['id', 'payment_key', 'amount', 'method', 'order_name', 'isRefundable'],
            },
        },
        notFoundMessage: '해당 결제 내역이 없습니다.',
    })
    @Get(':user_id')
    async getPointsByAmount(@Param('user_id') user_id: number): Promise<Payment[]> {
        return this.billingService.findPaymentByUserId(user_id);
    }
}