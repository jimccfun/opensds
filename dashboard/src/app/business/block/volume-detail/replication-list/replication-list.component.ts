import {Component, Input, OnInit} from '@angular/core';
import { I18NService } from 'app/shared/api';
import { VolumeService ,ReplicationService} from './../../volume.service';

@Component({
  selector: 'app-replication-list',
  templateUrl: './replication-list.component.html',
  styleUrls: [

  ]
})
export class ReplicationListComponent implements OnInit {
    @Input() volumeId;
    volume={
        name:""
    };
    replication ={
        name:"replication",
        replicationPeriod:30
    };
    showReplication:boolean=false;
    constructor(
       public I18N:I18NService,
       private VolumeService:VolumeService,
       private replicationService:ReplicationService
              ) {  }

    ngOnInit() {
      this.getVolumeById(this.volumeId);
      this.getReplicationByVolumeId(this.volumeId)
    }
    getVolumeById(volumeId){
        this.VolumeService.getVolumeById(volumeId).subscribe((res) => {
            this.volume = res.json();
        });
    }
    getReplicationByVolumeId(volumeId){
        let param = {
            "key": "PrimaryVolumeId",
            "value":volumeId
        }
        this.replicationService.getReplicationDetailByVolumeId(param).subscribe((res) => {
            var data = res.json();
            if(data.length !== 0){
                this.replication = data[0];
                this.showReplication = true;
            }
            console.log(this.replication);
        });
    }

}
