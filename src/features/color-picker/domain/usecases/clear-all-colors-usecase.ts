import { type UserCase } from '@/core/interfaces/usercase'
import type ColorRepository from '@/features/color-picker/domain/repositories/color-repository'

export default class ClearAllColorsUseCase
  implements UserCase<void, Promise<void>>
{
  constructor(private readonly repository: ColorRepository) {}

  async execute(): Promise<void> {
    await this.repository.removeAllColors()
  }
}
