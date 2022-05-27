import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanListComponent } from './component/plan-list/plan-list.component';
import { ZezcudihComponent } from './component/screencodes/zezcudih/zezcudih.component';
import { BuimttjyComponent } from './component/screencodes/buimttjy/buimttjy.component';
import { UgbtofihComponent } from './component/screencodes/ugbtofih/ugbtofih.component';
import { MjdkyidfComponent } from './component/screencodes/mjdkyidf/mjdkyidf.component';
import { XsgwuwyoComponent } from './component/screencodes/xsgwuwyo/xsgwuwyo.component';
import { NnbombosComponent } from './component/screencodes/nnbombos/nnbombos.component';
import { TdpnysbrComponent } from './component/screencodes/tdpnysbr/tdpnysbr.component';
import { KfbtvvclComponent } from './component/screencodes/kfbtvvcl/kfbtvvcl.component';
import { GyjhdxenComponent } from './component/screencodes/gyjhdxen/gyjhdxen.component';
import { FhrajgrzComponent } from './component/screencodes/fhrajgrz/fhrajgrz.component';
import { JzzmrqphComponent } from './component/screencodes/jzzmrqph/jzzmrqph.component';
import { VzfnlwepComponent } from './component/screencodes/vzfnlwep/vzfnlwep.component';
import { HewjbadxComponent } from './component/screencodes/hewjbadx/hewjbadx.component';
import { ShmyjxqpComponent } from './component/screencodes/shmyjxqp/shmyjxqp.component';
import { BaiknmbdComponent } from './component/screencodes/baiknmbd/baiknmbd.component';
import { RsweahxfComponent } from './component/screencodes/rsweahxf/rsweahxf.component';
import { RetjegemComponent } from './component/screencodes/retjegem/retjegem.component';

const routes: Routes = [
  {
    path: 'planTemplate',
    children: [
      {
        path: '',
        redirectTo: '/',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'plans/category/:type',
        component: PlanListComponent,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'plans/:id',
        component: PlanListComponent,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'zezcudih/:action',
        component: ZezcudihComponent,
      },
      {
        path: 'zezcudih/:action/:id',
        component: ZezcudihComponent,
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'xsgwuwyo/:action',
        component: XsgwuwyoComponent,
      },
      {
        path: 'xsgwuwyo/:action/:id',
        component: XsgwuwyoComponent,
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'ugbtofih/:action',
        component: UgbtofihComponent,
      },
      {
        path: 'ugbtofih/:action/:id',
        component: UgbtofihComponent,
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'mjdkyidf/:action',
        component: MjdkyidfComponent,
      },
      {
        path: 'mjdkyidf/:action/:id',
        component: MjdkyidfComponent,
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'buimttjy/:action',
        component: BuimttjyComponent,
      },
      {
        path: 'buimttjy/:action/:id',
        component: BuimttjyComponent,
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'rsweahxf/:action',
        component: RsweahxfComponent,
      },
      {
        path: 'rsweahxf/:action/:id',
        component: RsweahxfComponent,
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'baiknmbd/:action',
        component: BaiknmbdComponent,
      },
      {
        path: 'baiknmbd/:action/:id',
        component: BaiknmbdComponent,
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'nnbombos/:action',
        component: NnbombosComponent,
      },
      {
        path: 'nnbombos/:action/:id',
        component: NnbombosComponent,
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'tdpnysbr/:action',
        component: TdpnysbrComponent,
      },
      {
        path: 'tdpnysbr/:action/:id',
        component: TdpnysbrComponent,
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'kfbtvvcl/:action',
        component: KfbtvvclComponent,
      },
      {
        path: 'kfbtvvcl/:action/:id',
        component: KfbtvvclComponent,
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'gyjhdxen/:action',
        component: GyjhdxenComponent,
      },
      {
        path: 'gyjhdxen/:action/:id',
        component: GyjhdxenComponent,
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'fhrajgrz/:action',
        component: FhrajgrzComponent,
      },
      {
        path: 'fhrajgrz/:action/:id',
        component: FhrajgrzComponent,
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'jzzmrqph/:action',
        component: JzzmrqphComponent,
      },
      {
        path: 'jzzmrqph/:action/:id',
        component: JzzmrqphComponent,
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'vzfnlwep/:action',
        component: VzfnlwepComponent,
      },
      {
        path: 'vzfnlwep/:action/:id',
        component: VzfnlwepComponent,
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'hewjbadx/:action',
        component: HewjbadxComponent,
      },
      {
        path: 'hewjbadx/:action/:id',
        component: HewjbadxComponent,
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'shmyjxqp/:action',
        component: ShmyjxqpComponent,
      },
      {
        path: 'shmyjxqp/:action/:id',
        component: ShmyjxqpComponent,
      },
    ],
  },
  {
    path: 'planTemplate',
    children: [
      {
        path: 'retjegem/:action',
        component: RetjegemComponent,
      },
      {
        path: 'retjegem/:action/:id',
        component: RetjegemComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanTemplateRoutingModule {}
