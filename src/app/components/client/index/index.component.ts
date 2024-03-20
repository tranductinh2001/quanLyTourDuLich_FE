import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import {
  faBars,
  faHeart,
  faPhone,
  faRightFromBracket,
  faShoppingBag,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../service/auth.service';
import { CartService } from '../../../service/cart.service';
import { DestinationsService } from '../../../service/destinations.service';
import { ServiceService } from '../../../service/service.service';
import { StorageService } from '../../../service/storage.service';
import { TourService } from '../../../service/tour.service';
import { WishlistService } from '../../../service/wishlist.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
  providers: [MessageService],
})
export class IndexComponent {
  listDestinations: any[] = [];

  heart = faHeart;
  bag = faShoppingBag;
  phone = faPhone;
  userIcon = faUser;
  logoutIcon = faRightFromBracket;
  bars = faBars;

  p: number = 1;
  isLoggedIn = false;
  roles: string[] = [];
  username!: string;
  listService: any[] = [];
  listTour: any[] = [];

  keyword: any;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private messageService: MessageService,
    private router: Router,
    private destinationsService: DestinationsService,
    private serviceService: ServiceService,
    private tourservice: TourService,
    public cartService: CartService, 
    public wishlistService: WishlistService, 
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAllListDestinations();
    this.getAllService();
    this.getTour();
    this.isLoggedIn = this.storageService.isLoggedIn();
    this.username = this.storageService.getUser().user?.username;
    this.roles = this.storageService.getUser().user?.roles;

  }

  addToCart(item: any){
    this.cartService.getItems();
    this.openSnackBar('đã thêm tour ' +item.name+' thêm vào giỏ hàng', 'Close');
    this.cartService.addToCart(item,1);
  }
  
  addToWishList(item: any){
    if(!this.wishlistService.productInWishList(item)){
      this.openSnackBar('đã thêm tour ' +item.name+' thêm vào danh sách yêu thích', 'Close');
      this.wishlistService.addToWishList(item);
    }
  }
  

  getTour() {
    this.tourservice.getAllTour().subscribe({
      next: (res) => {
        this.listTour = res;
      },
      error: (err) => {
        console.log('lỗi lấy all tour');
      },
    });
  }

  getAllService() {
    this.serviceService.getAllService().subscribe({
      next: (res) => {
        this.listService = res;
      },      error: err => {
        console.log('Lỗi tìm all service', err);
      }
    });
  }

  getAllListDestinations() {
    this.destinationsService.getListDestinationsHot().subscribe({
      next: (res) => {
        this.listDestinations = res;
        console.log(this.listDestinations)
      },
      error: (err) => {
        console.log('lỗi lấy destination tour');
      },
    });
  }

  logout(): void {
    this.authService.logout(this.username).subscribe({
      next: (res) => {
        this.storageService.clean();
        this.isLoggedIn = false;
        this.showSuccess('Bạn đã đăng xuất!!');
      },
      error: (err) => {
        this.showError(err.message);
      },
    });
  }

  showSuccess(text: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: text,
    });
  }
  showError(text: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: text,
    });
  }

  showWarn(text: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warn',
      detail: text,
    });
  }

  openSnackBar(message: string, action: string) {
    const config = new MatSnackBarConfig();
    config.duration = 3000; // Thời gian hiển thị thông báo (ms)
    config.panelClass = ['custom-snackbar']; // Sử dụng style custom
    this.snackBar.open(message, action, config);
  }
}
