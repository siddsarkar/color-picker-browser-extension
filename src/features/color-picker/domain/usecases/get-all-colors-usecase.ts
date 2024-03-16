import { type UserCase } from '@/core/interfaces/usercase'
import type Color from '@/features/color-picker/domain/entities/color'
import type ColorRepository from '@/features/color-picker/domain/repositories/color-repository'

export default class GetAllColorsUseCase
  implements UserCase<void, Promise<Color[]>>
{
  constructor(private readonly repository: ColorRepository) {}

  async execute(): Promise<Color[]> {
    return await this.repository.getAllColors()
  }
}
