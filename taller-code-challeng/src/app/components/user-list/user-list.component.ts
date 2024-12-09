import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ApiService, User } from '../../services/api-service';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from './user-card/user-card.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UserCardComponent, ReactiveFormsModule],
  providers: [ApiService],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit, OnDestroy {
  private userService = inject(ApiService);

  public users: User[] = [];

  public destroy$ = new Subject<void>();

  public searchText = new FormControl();

  public formGroup = new FormGroup({
    searchText: this.searchText,
  });

  ngOnInit(): void {
    this.userService
      .getUsers()
      .pipe(
        take(1),
        tap((result) => (this.users = result))
      )
      .subscribe();

    this.searchText.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((name) => {
          if (name) {
            return this.userService.getUsersByName(name);
          }

          return this.userService.getUsers();
        }),
        tap((result) => (this.users = result))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
