import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENTS_SERVICE } from '@app/common';

import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentService: ClientProxy,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    this.paymentService
      .send('create_charge', createReservationDto.charge)
      .subscribe(async (res) => {
        console.log({ res });
        return this.reservationRepository.create({
          ...createReservationDto,
          timestamps: new Date(),
          userId,
        });
      });
  }

  async findAll() {
    return this.reservationRepository.find({});
  }

  async findOne(_id: string) {
    return this.reservationRepository.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  async remove(_id: string) {
    return this.reservationRepository.findOneAndDelete({ _id });
  }
}
