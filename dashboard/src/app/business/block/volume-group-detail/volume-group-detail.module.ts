import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolumeGroupDetailComponent } from './volume-group-detail.component';
import { RouterModule } from '@angular/router';

let routers = [{
  path: '',
  component: VolumeGroupDetailComponent
}]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routers),
  ],
  declarations: [VolumeGroupDetailComponent]
})
export class VolumeGroupDetailModule { }
