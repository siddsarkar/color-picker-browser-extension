import { type UserCase } from '@/core/interfaces/usercase'
import type Color from '@/features/color-picker/domain/entities/color'
import type ColorRepository from '@/features/color-picker/domain/repositories/color-repository'

export default class SaveColorUseCase
  implements UserCase<Color, Promise<void>>
{
  constructor(private readonly repository: ColorRepository) {}

  async execute(params: Color): Promise<void> {
    await this.repository.addColor(params)
  }
}
