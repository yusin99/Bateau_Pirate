import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  email!: string;
  mdp1!: string;
  mdp2!: string;
  nom!: string;
  prenom!: string;
  pseudo!: string;
  photoUrl: string =
    'https://www.seekpng.com/png/full/356-3562377_personal-user.png';
  error!: string;
  success!: string;
  constructor(
    private authService: SocialAuthService,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}
  register(form: NgForm) {
    const email = this.email;
    const mdp1 = this.mdp1;
    const mdp2 = this.mdp2;
    const nom = this.nom;
    const prenom = this.prenom;
    const pseudo = this.pseudo;
    const photoUrl = this.photoUrl;
    if (form.invalid) {
      return;
    }
    if (mdp1 === mdp2) {
      this.userService
        .registerUser(email, mdp1, pseudo, nom, prenom, photoUrl)
        .subscribe(
          (data) => {
            console.log(data);
            this.error = '';
            this.success = data.message;
            form.reset();
          },
          (error) => {
            console.log(error.error.errors[0].msg);
            this.error = error.error.errors[0].msg;
          }
        );
    } else {
      this.error = "Passwords doesn't match";
    }
  }
}
