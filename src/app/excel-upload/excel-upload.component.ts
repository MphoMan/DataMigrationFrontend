import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-excel-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './excel-upload.component.html',
  styleUrls: ['./excel-upload.component.css']
})
export class ExcelUploadComponent {
  uploadForm: FormGroup;
  fileToUpload: File | null = null;
  message: string = ''; // To store the message

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.uploadForm = this.fb.group({
      excelUrl: ['', [Validators.required, Validators.pattern(/.*\.(xls|xlsx)$/)]]
    });
  }

  get excelUrl() {
    return this.uploadForm.get('excelUrl');
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
      this.uploadForm.patchValue({ excelUrl: file.name });
    }
  }

  onSubmit() {
    if (this.uploadForm.valid && this.fileToUpload) {
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload);

      this.http.post('http://localhost:8080/api/excel/read', formData, { observe: 'response' })
      .subscribe(response => {
        if (response.status === 200) {
          this.message = 'Upload successful!';
        }
      }, error => {
        if (error.status === 409) {
          this.message = 'The file/data already exists in the database.';
        } else {
          this.message = 'Upload failed. Please try again.';
        }
      });
    } else {
      this.message = 'Please select a valid Excel file to upload.';
    }
  }
}
