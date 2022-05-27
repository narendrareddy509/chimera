import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'publishStatus',
})
export class PublishStatusPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(statusCode: string = ''): unknown {
    if (!statusCode) {
      return '';
    }

    let status = {
      text: '',
      color: 'badge--default',
      type: 'secondary',
    };

    switch (statusCode) {
      case 'NOT_PUBLISHED': {
        status.text = this.translateService.instant('plan.alertMessages.notPublished');
        break;
      }
      case 'PUBLISH_STARTED': {
        status.text = this.translateService.instant('plan.alertMessages.publishStarted');
        status.color = 'badge--blue';
        status.type = 'primary';
        break;
      }
      case 'PUBLISH_IN_PROGRESS': {
        status.text = this.translateService.instant('plan.alertMessages.publishInProgress');
        status.color = 'badge--orange';
        status.type = 'danger';
        break;
      }
      case 'PUBLISHED': {
        status.text = this.translateService.instant('plan.alertMessages.published');
        status.color = 'badge--green';
        status.type = 'success';
        break;
      }

      default:
        status.text = this.translateService.instant('plan.alertMessages.notPublished');
    }

    return status;
  }

}
