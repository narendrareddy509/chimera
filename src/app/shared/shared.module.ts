import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './custom/component/sidebar/sidebar.component';
import { LangSelectComponent } from './custom/component/lang-select/lang-select.component';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RouterModule } from '@angular/router';
import { AppInterceptor } from './custom/service/app.interceptor';
import { MinMaxPipe } from './custom/pipe/min-max.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from './custom/component/confirm-modal/confirm-modal.component';
import { ModalComponent } from './custom/component/modal/modal.component';
import { IconsModule } from './libraries/module/icons.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToastContainerComponent } from './custom/component/toast-container/toast-container.component';

@NgModule({
  declarations: [
    SidebarComponent,
    LangSelectComponent,
    MinMaxPipe,
    ConfirmModalComponent,
    ModalComponent,
    ToastContainerComponent,
  ],
  imports: [
    RouterModule,
    NgbModule,
    CommonModule,
    DragDropModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
    ReactiveFormsModule,
    FormsModule,
    IconsModule,
  ],
  exports: [
    RouterModule,
    NgbModule,
    DragDropModule,
    FlexLayoutModule,
    HttpClientModule,
    TranslateModule,
    ReactiveFormsModule,
    IconsModule,
    SidebarComponent,
    LangSelectComponent,
    ToastContainerComponent,
    MinMaxPipe,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true,
    },
  ],
  entryComponents: [],
})
export class SharedModule {}
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
