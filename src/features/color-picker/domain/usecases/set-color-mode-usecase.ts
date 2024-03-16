import { type ColorMode } from '@/core/enums/color-mode'
import { type UserCase } from '@/core/interfaces/usercase'
import type ColorRepository from '@/features/color-picker/domain/repositories/color-repository'

export default class SetColorModeUseCase
  implements UserCase<ColorMode, Promise<void>>
{
  constructor(private readonly repository: ColorRepository) {}

  async execute(params: ColorMode): Promise<void> {
    await this.repository.setColorMode(params)
  }
}
