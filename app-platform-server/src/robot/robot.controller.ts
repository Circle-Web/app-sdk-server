import { Body, Controller, Post } from '@nestjs/common';
import { KeywordTriggerDto } from './dto/keyword-trigger.dto';
import { RobotService } from './robot.service';

@Controller('api/robot')
export class RobotController {
  constructor(private readonly robotService: RobotService) { }

  @Post('chatKeywordTrigger')
  chatKeywordTrigger(@Body() keywordTriggerDto: KeywordTriggerDto) {
    return this.robotService.chatKeywordTrigger(keywordTriggerDto);
  }

}
