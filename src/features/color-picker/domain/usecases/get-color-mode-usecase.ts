import { type ColorMode } from '@/core/enums/color-mode'
import { type UserCase } from '@/core/interfaces/usercase'
import type ColorRepository from '@/features/color-picker/domain/repositories/color-repository'

export default class GetColorModeUseCase
  implements UserCase<void, Promise<ColorMode>>
{
  constructor(private readonly repository: ColorRepository) {}

  async execute(): Promise<ColorMode> {
    return await this.repository.getColorMode()
  }
}
