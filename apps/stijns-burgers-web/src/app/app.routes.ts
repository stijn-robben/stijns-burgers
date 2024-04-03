/* eslint-disable @nx/enforce-module-boundaries */
import { Route } from '@angular/router';
import { HomeComponent } from 'libs/stijns-burgers/features/src/lib/homepage/home.component';
import { MenuItemListComponent } from 'libs/stijns-burgers/features/src/lib/menu-item/menu-item-list/menu-item-list.component';
import { LoginComponent } from 'libs/stijns-burgers/auth/src/lib/auth/login/login.component';
import { ProfileComponent } from 'libs/stijns-burgers/auth/src/lib/auth/profile/profile.component';
// import { UserDetailComponent } from 'libs/share-a-meal/features/src/lib/user/user-detail/user-detail.component';
// import { UserListComponent } from 'libs/share-a-meal/features/src/lib/user/user-list/user-list.component';
// import { UserEditComponent } from 'libs/share-a-meal/features/src/lib/user/user-edit/user-edit.component';
export const appRoutes: Route[] = [
    //  {
    //      path: 'user/new',
    //      component: UserEditComponent,
    //      pathMatch: 'full'
    //  },
    //  {
    //      path: 'user/edit/:id',
    //      component: UserEditComponent,
    //      pathMatch: 'full'
    //  },
    // {
    //     path: 'user/:id',
    //     component: UserDetailComponent,
    //     pathMatch: 'full'
    // },
    // {
    //     path: 'user',
    //     component: UserListComponent,
    //     pathMatch: 'full'
    // },
   
    {
        path: 'menu',
        component: MenuItemListComponent,
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        pathMatch: 'full'
    },
    {
        path: 'profile',
        component: ProfileComponent,
        pathMatch: 'full'
    },
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
    },
    {
        path: '**',
        component: HomeComponent,
        pathMatch: 'full'
    }
];