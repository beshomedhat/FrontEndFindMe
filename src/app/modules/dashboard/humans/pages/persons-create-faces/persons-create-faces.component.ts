import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FaceApiService } from 'app/modules/dashboard/humans/services/face-api.service';
import { ToastrService, Toast } from 'ngx-toastr';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { ItemsService } from '@@core/services/items.service';
import { delay, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-persons-create-faces',
  templateUrl: './persons-create-faces.component.html',
  styleUrls: ['./persons-create-faces.component.scss'],
})
export class PersonsCreateFacesComponent implements OnInit {
  isLoadingResults = false;
  item_id;
  faceForm: FormGroup;
  selectedPersonId;
  images = [];
  constructor(
    private router: Router,
    private faceApi: FaceApiService,
    private toastr: ToastrService,
    private actRoute: ActivatedRoute,
    private fb: FormBuilder,
    private itemServ: ItemsService
  ) {}

  ngOnInit(): void {
    this.item_id = this.actRoute.snapshot.paramMap.get('id1');
    this.selectedPersonId = this.actRoute.snapshot.paramMap.get('id2');
    this.faceForm = this.fb.group({
      file: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    this.isLoadingResults = true;
    this.toastr.success(
      ' ',
      'Upload Image Process May by Take Alot Of Time...'
    );
    let data = {
      item_id: this.item_id,
      images: this.images,
    };
    for (let i = 0; i < this.images.length; i++) {
      this.faceApi
        .addPersonFace(3, this.selectedPersonId, this.b64toFile(this.images[i]))
        .subscribe(
          (res) => {
            console.log('.addPersonFace', res);
            console.log('.addPersonFac i : ', i);
          },
          (err) => {
            this.toastr.error(
              err['error']['message'],
              'Some Thing Wrong Please Try Again'
            );

            this.isLoadingResults = false;
          }
        );
      this.faceApi
        .addFaceFromLocal(
          'testfacelistcreate2020',
          this.b64toFile(this.images[i])
        )
        .subscribe(
          (res) => {
            console.log('.addFaceFromLocal', res);
            console.log('.addFaceFromLocal  i : ', i);
          },
          (err) => {
            this.toastr.error(
              err['error']['message'],
              'Some Thing Wrong Please Try Again'
            );
            this.isLoadingResults = false;
          }
        );
    } //end of for loop

    this.itemServ
      .uploadPersonFaces(data)
      .pipe(delay(2))
      .subscribe((res) => {
        this.isLoadingResults = false;
        this.router.navigateByUrl(
          `/dashboard/humans/persons/questions/${this.item_id}`
        );
      });
  }
  /****************** File uploading Function************************/
  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.images.push(event.target.result);
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  b64toFile(dataURI): File {
    // convert the data URL to a byte string
    const byteString = atob(dataURI.split(',')[1]);

    // pull out the mime type from the data URL
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // Convert to byte array
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // Create a blob that looks like a file.
    const blob = new Blob([ab], { type: mimeString });
    blob['lastModifiedDate'] = new Date().toISOString();
    blob['name'] = 'file';

    // Figure out what extension the file should have
    switch (blob.type) {
      case 'image/jpeg':
        blob['name'] += '.jpg';
        break;
      case 'image/png':
        blob['name'] += '.png';
        break;
    }
    // cast to a File
    return <File>blob;
  }
} //end of Class

// addPersonFaceByUrl() {
//   // this.formDialog.open(this.addByUrl);
//   // this.dialogService.confirmed().subscribe((confirmed) => {
//   //   console.log('sd : ', confirmed);
//   // });

//   this.fileNameDialogRef = this.dialog.open(FormDialogComponent, {
//     hasBackdrop: false,
//   });
//   this.fileNameDialogRef.afterClosed().subscribe((res) => {
//     console.log('res', res);
//   });
// }
// addPersonFaceFromLocal() {
//   this.router.navigateByUrl(
//     `/humans/addface/${this.selectedPersonId}/group/${this.selectedGroupId}`
//   );
// }

// deletePersonFace(persistedFaceId) {
//   this.dialogService.open(this.options);
//   this.dialogService.confirmed().subscribe((confirmed) => {
//     if (confirmed) {
//       this.isLoadingResults = true;
//       this.faceApi
//         .deletePersonFace(
//           this.selectedGroupId,
//           this.selectedPersonId,
//           persistedFaceId
//         )
//         .subscribe(
//           (data) => {
//             this.popToast({
//               type: 'success',
//               title: 'Person Face Deleted Sussessfully',
//               showCloseButton: true,
//             });
//             this.isLoadingResults = false;
//             location.reload();
//           },
//           (err) => {
//             this.popToast({
//               type: 'error',
//               title: 'Some Thing Wrong Please Try Again',
//               showCloseButton: true,
//             });
//             this.isLoadingResults = false;
//           }
//         );
//     }
//   });
// }
