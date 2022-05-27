/**
 * IconsModule is to import and use feather icons in our application
 *
 *
 * @author Ignatica - [Narendrareddy Chitta]
 *
 */
import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

@NgModule({
  imports: [FeatherModule.pick(allIcons)],
  exports: [FeatherModule],
})
export class IconsModule {}
