import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';
import { VolumeService ,VolumeGroupService} from './../volume.service';
import { ProfileService } from './../../profile/profile.service';
import { I18NService, Utils } from 'app/shared/api';
import { TabViewModule,ButtonModule, DataTableModule, DropMenuModule, DialogModule, FormModule, InputTextModule, InputTextareaModule, ConfirmDialogModule ,ConfirmationService} from './../../../components/common/api';

@Component({
  selector: 'app-volume-group-detail',
  templateUrl: './volume-group-detail.component.html',
  providers: [ConfirmationService],
  styleUrls: []
})
export class VolumeGroupDetailComponent implements OnInit {
  items = [];
  volumeGroupId:string;
  volumeGroup:any;
  label:any;
  profileJson = {};
  volumes=[];
  constructor(
    private VolumeService: VolumeService,
    private ActivatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private VolumeGroupService:VolumeGroupService,
    private confirmationService:ConfirmationService,
    public I18N:I18NService
  ) { }

  ngOnInit() {
    this.ActivatedRoute.params.subscribe(
      (params) => this.volumeGroupId = params.groupId
    );
    this.getProfiles();
    this.items = [
      { label: this.I18N.keyID["sds_block_volume_title"], url: '/block' },
      { label: this.I18N.keyID["sds_block_volume_detail"], url: '/volumeDetail' }
    ];
    this.label = {
      Name: this.I18N.keyID["sds_block_volume_name"],
      Profile: this.I18N.keyID["sds_block_volume_profile"],
      Status: this.I18N.keyID["sds_block_volume_status"],
      groupId: this.I18N.keyID["sds_block_volume_group_id"],
      description:this.I18N.keyID["sds_block_volume_descri"],
      CreatedAt: this.I18N.keyID["sds_block_volume_createat"]
    };
  }
  getVolumeGroupById(groupId){
    this.VolumeGroupService.getVolumeGroupById(groupId).subscribe((res)=>{
      let volumeGroup = res.json();
      if(volumeGroup && volumeGroup.length != 0){
          if(!volumeGroup.description){
            volumeGroup.description = "--";
          }
          let profileName = [];
          volumeGroup.profiles.forEach((profileId)=>{
              profileName.push(this.profileJson[profileId]);
          });
          volumeGroup.profileName = profileName;
      }
      this.volumeGroup = volumeGroup;
    });
  }
  getProfiles() {
    this.profileService.getProfiles().subscribe((res) => {
        let profiles = res.json();
        profiles.forEach(profile => {
            this.profileJson[profile.id] = profile.name;
        });
        this.getVolumeGroupById(this.volumeGroupId);
        this.getVolumesByGroupId(this.volumeGroupId);
    });
  }
  getVolumesByGroupId(volumeGroupId){
    this.VolumeService.getVolumeByGroupId(volumeGroupId).subscribe((res)=>{
      let volumes = res.json();
      if(volumes && volumes.length != 0){
        volumes.forEach((item)=>{
          item.profileName = this.profileJson[item.profileId];
        });  
      }
      this.volumes = volumes;
    });
  };
  addVolumesToGroup(){
    let param = {
      "addVolumes": [
          "c5d89eb3-9d28-43db-bd9e-8e1ee6ea657e"
      ],
    }
    this.VolumeGroupService.addOrRemovevolumes(this.volumeGroupId,param).subscribe((res)=>{
        
    });
  }
  removeVolumeFromGroup(volume){
    let msg = "<div>Are you sure you want to remove the selected Volume ?</div><h3>[ "+ volume.name +"]</h3>";
    let header ="Remove Volume";
    let acceptLabel = "Remove";
    let warming = true;
    this.confirmDialog([msg,header,acceptLabel,warming,"remove",volume])
  }
  confirmDialog([msg,header,acceptLabel,warming=true,func,data]){
    this.confirmationService.confirm({
        message: msg,
        header: header,
        acceptLabel: acceptLabel,
        isWarning: warming,
        accept: ()=>{
            try {
              if(func === "remove"){
                let param = {
                  "removeVolumes": [
                    data.id
                  ],
                }
                this.VolumeGroupService.addOrRemovevolumes(this.volumeGroupId,param).subscribe((res)=>{
                  this.getProfiles();
                });
              }
            }
            catch (e) {
                console.log(e);
            }
            finally {
                
            }
        },
        reject:()=>{}
    })
  }

}
